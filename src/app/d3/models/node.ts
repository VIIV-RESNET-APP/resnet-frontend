import APP_CONFIG from '../../app.config';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  totalNodes: number = 0

  id: string | number;
  degree: number = 0;
  label: string

  weight?: number

  popover: PopoverNode

  constructor(id: string | number, totalNodes: number, label: string, popover: PopoverNode, weight?: number) {
    this.id = id;
    this.totalNodes = totalNodes
    this.label = label
    this.popover = popover
    this.weight = weight
  }

  normal = () => {
    return Math.sqrt(this.degree / this.totalNodes);
  }

  get r() {
    if (this.weight) {
      if (this.totalNodes <= 25) {
        return Math.sqrt(this.weight) * 12
      } else if (this.totalNodes <= 50) {
        return Math.sqrt(this.weight) * 9
      } else if (this.totalNodes <= 75) {
        return Math.sqrt(this.weight) * 6
      } else if (this.totalNodes <= 100) {
        return Math.sqrt(this.weight) * 3
      } else {
        return 0
      }
    } else {
      return this.normal() === 0 ? 60 : 50 * this.normal() + 10;
    }
  }

  get fontSize() {
    if (this.weight) {
      if (this.totalNodes <= 25) {
        return Math.sqrt(this.weight) * 11 + 'px'
      } else if (this.totalNodes <= 50) {
        return Math.sqrt(this.weight) * 8 + 'px'
      } else if (this.totalNodes <= 75) {
        return Math.sqrt(this.weight) * 5 + 'px'
      } else if (this.totalNodes <= 100) {
        return Math.sqrt(this.weight) * 2 + 'px'
      } else {
        return 0
      }
    } else {
      return this.normal() === 0 ? 40 : (30 * this.normal() + 10) + 'px';
    }
  }

  get color() {
    let index = Math.ceil((this.degree * (APP_CONFIG.SPECTRUM.length - 1)) / (this.totalNodes - 1))
    return APP_CONFIG.SPECTRUM[index];
  }
}

export interface PopoverNode {
  enablePopover: boolean
  title?: string
  content?: string
  link?: string
}
