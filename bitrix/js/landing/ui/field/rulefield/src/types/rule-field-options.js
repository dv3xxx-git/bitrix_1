
export interface FormField
{
	id: string,
	label: string,
	items: Array<{value: any, label: string}>,
	type: string,
}

export interface ExpressionEntry {
	field: string,
	action: 'show' | 'hide',
}

export interface RuleEntryOptions
{
	condition: {
		field: string,
		value: any,
		operator: '=' | '!=',
	},
	expression: Array<ExpressionEntry>,
}

export interface FieldRulesOptions extends RuleEntryOptions
{
	fields: Array<FormField>,
}

export interface RuleFieldOptions
{
	fields: Array<FormField>,
	rules: Array<FieldRules>
}