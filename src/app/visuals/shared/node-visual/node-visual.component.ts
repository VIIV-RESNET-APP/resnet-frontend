import {Component, Input} from '@angular/core';
import {Node} from '../../../d3';
import {Router} from "@angular/router";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: '[nodeVisual]',
  template: `
    <ng-template #popTitle>{{node.popover.title}}</ng-template>
    <ng-template #popContent>
      <a *ngIf="node.popover.link; else elseLink" [href]="node.popover.link">
        {{node.popover.content}}
      </a>
      <ng-template #elseLink>{{node.popover.content}}</ng-template>
    </ng-template>


    <svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'"
           [ngbPopover]="popContent"
           [popoverTitle]="popTitle"
           triggers="manual"
           #p1="ngbPopover"
           (click)="togglePopover(p1)"
           container="body">
      <svg:circle
        class="node"
        [attr.fill]="node.color"
        cx="0"
        cy="0"
        [attr.r]="node.r">
      </svg:circle>
      <svg:text
        class="node-name"
        [attr.font-size]="node.fontSize">
        {{node.label ? node.label : node.id}}
      </svg:text>
    </svg:g>
  `,
  styleUrls: ['./node-visual.component.scss']
})
export class NodeVisualComponent {
  @Input('nodeVisual') node: Node;

  constructor(private router: Router) {
  }

  togglePopover(popover: NgbPopover) {
    console.log(this.node)
    if (this.node.popover.enablePopover) {
      if (popover.isOpen()) {
        popover.close();
      } else {
        popover.open();
      }
    }
  }

  navigate() {
    this.router.navigate(['author', this.node.id])
  }
}
