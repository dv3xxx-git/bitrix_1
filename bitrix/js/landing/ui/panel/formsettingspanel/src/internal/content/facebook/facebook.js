import {ContentWrapper} from 'landing.ui.panel.basepresetpanel';
import {HeaderCard} from 'landing.ui.card.headercard';
import {Loc} from 'landing.loc';
import {Button} from 'ui.buttons';
import {BaseCard} from 'landing.ui.card.basecard';
import {Dom} from 'main.core';
import {type FormOptions} from 'crm.form.type';
import {FormClient} from 'crm.form.client';

export default class FacebookContent extends ContentWrapper
{
	constructor(options)
	{
		super(options);
		this.setEventNamespace('BX.Landing.UI.Panel.FormSettingsPanel.FacebookContent');

		const header = new HeaderCard({
			title: Loc.getMessage('LANDING_SIDEBAR_BUTTON_FACEBOOK'),
		});

		const buttonCard = new BaseCard();
		const button = new Button({
			text: this.prepareButtonText(this.options.formOptions),
			color: Button.Color.LIGHT_BORDER,
			onclick: () => {
				BX.SidePanel.Instance.open(
					`/crm/webform/ads/${this.options.formOptions.id}/?type=facebook`,
					{
						cacheable: false,
						events: {
							onClose: () => {
								const client = FormClient.getInstance();
								client.resetCache(this.options.formOptions.id);

								client
									.getOptions(this.options.formOptions.id)
									.then((result) => {
										button.setText(this.prepareButtonText(result));
									});
							},
						},
					},
				);
			},
		});

		Dom.style(buttonCard.getLayout(), {
			padding: 0,
			margin: 0,
		});

		Dom.append(button.render(), buttonCard.getBody());

		this.addItem(header);
		this.addItem(buttonCard);
	}

	prepareButtonText(formOptions: FormOptions)
	{
		const enabled = formOptions.integration.cases.some((item) => {
			return item.providerCode === 'facebook';
		});

		if (enabled)
		{
			return Loc.getMessage('LANDING_FORM_SETTINGS_FACEBOOK_BUTTON_ENABLED');
		}

		return Loc.getMessage('LANDING_FORM_SETTINGS_FACEBOOK_BUTTON');
	}

	onChange(event: BaseEvent)
	{
		this.emit('onChange', {...event.getData(), skipPrepare: true});
	}
}