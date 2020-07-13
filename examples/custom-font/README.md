# Custom Font

This module uses 'sans-serif' font by default. However, in some environments where fonts are not installed, you have to register fonts by yourself. In addition, CJK users may want to change the default font.
You can register fonts using `registerFont` from node-canvas which is a peer dependency of table-renderer.

![custom font](./custom-font.png)

```javascript
import path from 'path';
import TableRenderer, { saveImage } from '../../src';
import { registerFont } from 'canvas';

registerFont(path.join(__dirname, 'fonts/Spoqa-Han-Sans-Regular.ttf'), { family: 'spoqa', weight: 'normal' });
registerFont(path.join(__dirname, 'fonts/Spoqa-Han-Sans-Bold.ttf'), { family: 'spoqa', weight: 'bold' });

const renderTable = TableRenderer({ fontFamily: 'spoqa' }).render;

const canvas = renderTable({
	title: 'Marketing Summary',
	columns: [
		{ width: 200, title: '캠페인', dataIndex: 'campaign' },
		{ width: 100, title: '설치수', dataIndex: 'install', align: 'right' },
		{ width: 100, title: '비용', dataIndex: 'cost', align: 'right' },
	],
	dataSource: [
		'-',
		{ campaign: 'Google CPC', install: '12', cost: '$ 400' },
		{ campaign: 'Facebook CPC', install: '3', cost: '$ 60' },
		{ campaign: 'Youtube Video', install: '131', cost: '$ 1,230' },
		'-',
		{ campaign: '합계', install: '146', cost: '$ 1,690' },
	],
});

saveImage(canvas, path.join(__dirname, 'custom-font.png'));
```
