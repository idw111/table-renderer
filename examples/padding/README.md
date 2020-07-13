# Adding Vertical and Horizontal Padding

To add a vertical padding, pass verticalPadding to TableRenderer options. To add a horizontal padding, pass horizontalPadding to TableRenderer options.

![vertical and horizontal padding](./padding.png)

```javascript
import path from 'path';
import TableRenderer, { saveImage } from '../../src';

const renderTable = TableRenderer({ paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#efefef' }).render;

const canvas = renderTable({
	title: 'Marketing Summary',
	columns: [
		{ width: 200, title: 'Campaign', dataIndex: 'campaign' },
		{ width: 100, title: 'Install', dataIndex: 'install', align: 'right' },
		{ width: 100, title: 'Cost', dataIndex: 'cost', align: 'right' },
	],
	dataSource: [
		'-',
		{ campaign: 'Google CPC', install: '12', cost: '$ 400' },
		{ campaign: 'Facebook CPC', install: '3', cost: '$ 60' },
		{ campaign: 'Youtube Video', install: '131', cost: '$ 1,230' },
		'-',
		{ campaign: 'Total', install: '146', cost: '$ 1,690' },
	],
});

saveImage(canvas, path.join(__dirname, 'padding.png'));
```
