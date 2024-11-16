const Navdata = [
	{
		label: 'Menu',
		isHeader: true
	},
	{
		icon: 'MessagesSquare',
		label: 'Chat',
		link: '/pages/chat',
		id: 'chat',
		stateVariables: 'isChat'
	},
	{
		icon: 'FileText',
		label: 'Invoices',
		link: '/pages/document-list',
		id: 'invoices',
		stateVariables: 'isInvoices',
	},
	{
		icon: 'Settings',
		label: 'Settings',
		link: "/pages/account-settings",
		id: 'settings',
		stateVariables: 'isSettings',
	}
];

const MOCK_DATA = {
	Navdata
};

export default MOCK_DATA;
