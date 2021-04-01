<?php
/**
 * Bitrix Framework
 * @package bitrix
 * @subpackage main
 * @copyright 2001-2020 Bitrix
 */

namespace Bitrix\Main\File\Image;

use Bitrix\Main\File;

class Imagick extends Engine
{
	/** @var \Imagick */
	protected $image;

	/**
	 * @inheritDoc
	 */
	public function getExifData()
	{
		if(function_exists("exif_read_data"))
		{
			return parent::getExifData();
		}

		$result = [];

		if($this->image !== null)
		{
			$exif = $this->image->getImageProperties("exif:*");

			foreach($exif as $name => $property)
			{
				$result[substr($name, 5)] = $property;
			}
		}

		return $result;
	}

	/**
	 * @inheritDoc
	 */
	public function load()
	{
		$this->clear();

		try
		{
			$this->image = new \Imagick($this->file);
			return true;
		}
		catch(\ImagickException $e)
		{
			return false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public function rotate($angle, Color $bgColor)
	{
		if($this->image === null)
		{
			return false;
		}

		$color = new \ImagickPixel($bgColor->toRgba());

		return $this->image->rotateImage($color, $angle);
	}

	/**
	 * @inheritDoc
	 */
	public function flipVertical()
	{
		if($this->image === null)
		{
			return false;
		}

		try
		{
			$this->image->flipImage();
			return true;
		}
		catch(\ImagickException $e)
		{
			return false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public function flipHorizontal()
	{
		if($this->image === null)
		{
			return false;
		}

		try
		{
			$this->image->flopImage();
			return true;
		}
		catch(\ImagickException $e)
		{
			return false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public function setOrientation($orientation)
	{
		if($this->image === null)
		{
			return false;
		}

		return $this->image->setImageOrientation($orientation);
	}

	/**
	 * @inheritDoc
	 */
	public function resize(Rectangle $source, Rectangle $destination)
	{
		if($this->image === null)
		{
			return false;
		}

		try
		{
			if($source->getX() <> 0 || $source->getY() <> 0)
			{
				//need crop
				$this->image->cropImage($source->getWidth(), $source->getHeight(), $source->getX(), $source->getY());
			}

			//hope Imagick will use the best filter automatically
			$filter = \Imagick::FILTER_UNDEFINED;

			//resizeImage has better quality than scaleImage (scaleImage uses a filter similar to FILTER_BOX)
			return $this->image->resizeImage($destination->getWidth(), $destination->getHeight(), $filter, 1);
		}
		catch(\ImagickException $e)
		{
			return false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public function filter(Mask $mask)
	{
		if($this->image === null)
		{
			return false;
		}

		$kernel = \ImagickKernel::fromMatrix($mask->getValue());

		$this->image->filter($kernel);

		return true;
	}

	/**
	 * @inheritDoc
	 */
	public function drawTextWatermark(TextWatermark $watermark)
	{
		if($this->image === null)
		{
			return false;
		}

		$font = $watermark->getFont();

		if(!file_exists($font))
		{
			return false;
		}

		$utfText = $watermark->getUtfText();

		$width = $this->getWidth();
		$height = $this->getHeight();

		$draw = new \ImagickDraw();
		$draw->setFont($font);
		$draw->setFillColor(new \ImagickPixel($watermark->getColor()->toRgba()));

		if(($textWidth = $watermark->getWidth()) > 0)
		{
			$draw->setFontSize(20);

			$metrics = $this->image->queryFontMetrics($draw, $utfText);

			$scale = 1.0;
			if($metrics["textWidth"] > 0)
			{
				$scale = $textWidth / $metrics["textWidth"];
			}

			$fontSize = 20 * $scale;
			$draw->setFontSize($fontSize);

			$position = new Rectangle($textWidth, $metrics["textHeight"] * $scale);
		}
		else
		{
			//in GD resolution is 96 dpi, we should increase size
			$fontSize = $watermark->getFontSize($width) * (96/72);
			$draw->setFontSize($fontSize);

			$metrics = $this->image->queryFontMetrics($draw, $utfText);

			$position = new Rectangle($metrics["textWidth"], $metrics["textHeight"]);
		}

		$watermark->alignPosition($width, $height, $position);

		$fontSize *= (72/90); //back to pixels

		if($watermark->getVerticalAlignment() == Watermark::ALIGN_BOTTOM)
		{
			//Try to take into consideration font's descenders.
			//Coordinates in annotateImage are for font's *baseline*.
			//Let the descenders be 20% of the font size.
			$descender = $fontSize * 0.2;
			$y = $position->getY() + $position->getHeight() - $descender; //baseline
		}
		else
		{
			$y = $position->getY() + $fontSize;
		}

		return $this->image->annotateImage($draw, $position->getX(), $y, 0, $utfText);
	}

	/**
	 * @inheritDoc
	 */
	public function drawImageWatermark(ImageWatermark $watermark)
	{
		if($this->image === null)
		{
			return false;
		}

		if(($image = $this->loadWatermark($watermark)) === null)
		{
			return false;
		}

		$watermarkWidth = $image->getWidth();
		$watermarkHeight = $image->getHeight();

		$position = new Rectangle($watermarkWidth, $watermarkHeight);

		$width = $this->getWidth();
		$height = $this->getHeight();

		$watermark->alignPosition($width, $height, $position);

		$watermarkAlpha = $watermark->getAlpha();

		if(intval(round($watermarkAlpha, 2)) < 1) //1% precision
		{
			//apply alpha to the watermark
			$image->image->evaluateImage(\Imagick::EVALUATE_MULTIPLY, $watermarkAlpha, \Imagick::CHANNEL_ALPHA);
		}

		$repeat = ($watermark->getMode() == ImageWatermark::MODE_REPEAT);

		$posY = $position->getY();
		while(true)
		{
			$posX = $position->getX();
			while(true)
			{
				$this->image->compositeImage($image->image, \Imagick::COMPOSITE_OVER, $posX, $posY);

				$posX += $watermarkWidth;
				if($repeat == false || $posX > $width)
				{
					break;
				}
			}

			$posY += $watermarkHeight;
			if($repeat == false || $posY > $height)
			{
				break;
			}
		}

		$image->clear();

		return true;
	}

	/**
	 * @inheritDoc
	 */
	public function save($file, $quality = 95, $format = null)
	{
		if($this->image === null)
		{
			return false;
		}

		$prefix = "";
		if($format !== null)
		{
			$format = static::convertFormat($format);
			if($format !== null)
			{
				$prefix = "{$format}:";
			}
		}

		$this->image->setImageCompressionQuality($quality);

		if($format === "gif" || ($format = $this->image->getImageFormat()) === "GIF" || $format === "GIF87")
		{
			//strange artefacts with transparency - we limit the palette to 255 colors to fix it
			$this->image->quantizeImage(255, \Imagick::COLORSPACE_SRGB, 0, false, false);
		}

		return $this->image->writeImage($prefix.$file);
	}

	/**
	 * @inheritDoc
	 */
	public function getWidth()
	{
		return $this->image->getImageWidth();
	}

	/**
	 * @inheritDoc
	 */
	public function getHeight()
	{
		return $this->image->getImageHeight();
	}

	/**
	 * @inheritDoc
	 */
	public function clear()
	{
		if($this->image !== null)
		{
			$this->image->clear();
			$this->image = null;
		}
	}

	protected static function convertFormat($format)
	{
		static $formats = [
			File\Image::FORMAT_BMP => "bmp",
			File\Image::FORMAT_GIF => "gif",
			File\Image::FORMAT_JPEG => "jpg",
			File\Image::FORMAT_PNG => "png",
			File\Image::FORMAT_WEBP => "webp",
		];

		if(isset($formats[$format]))
		{
			return $formats[$format];
		}
		return null;
	}
}
