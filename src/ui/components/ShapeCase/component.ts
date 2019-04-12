import Component from '@glimmer/component';

export default class ShapeCase extends Component {
	public clipId = Math.random().toString(36).substr(2, 5);

	get imageClipStyle() {
		const shouldClip = this.args.clipImage || true;

		if (!shouldClip) {
			return '';
		}

		return `clip-path: url(#${this.clipId});`;
	}

	get shapeStyle() {
		return `fill: ${this.args.color || '#007DF6'}`
	}
}
