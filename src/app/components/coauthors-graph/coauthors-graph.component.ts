import {Component, ElementRef, Inject, Input, ViewChild} from '@angular/core';
import {Link, Node} from "../../d3";
import {AuthorService} from "../../services/author.service";
import {Author, AuthorNode} from "../../interfaces/author.interface";

import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {DOCUMENT} from "@angular/common";
import * as htmlToImage from "html-to-image";

@Component({
  selector: 'app-coauthors-graph',
  templateUrl: './coauthors-graph.component.html',
  styleUrls: ['./coauthors-graph.component.scss']
})
export class CoauthorsGraphComponent {

  @Input() author: Author

  d3Nodes: Node[] = []
  d3Links: Link[] = []

  apiNodes: AuthorNode[] = []

  forces: { manyBody: number, collide: number } = {manyBody: 50, collide: 100}

  showGraph: boolean = false

  @ViewChild("downloadEl") downloadEl: ElementRef;
  faDownload = faDownload

  constructor(private authorService: AuthorService,
              @Inject(DOCUMENT) private coreDoc: Document) {
  }

  ngOnInit() {
    this.authorService.getCoauthorsById(this.author.scopusId).subscribe((coauthors) => {
      this.apiNodes = coauthors.nodes
      this.apiNodes.push({
        scopusId: this.author.scopusId,
        initials: this.author.initials,
        firstName: this.author.firstName,
        lastName: this.author.lastName,
        weight: 0
      })
      this.setupNodes()
      this.setupLinks(coauthors.links)
      this.showGraph = true
    })
  }

  setupNodes() {
    this.apiNodes.forEach(node => {
      this.d3Nodes.push(new Node(node.scopusId, this.apiNodes.length, node.initials, {
        enablePopover: true,
        title: 'Autor',
        content: node.firstName && node.lastName ? `${node.firstName} ${node.lastName}` : node.lastName || '',
        link: 'author/' + node.scopusId
      }))
    })
  }

  setupLinks(links: { source: number, target: number, collabStrength: number }[]) {
    links.forEach(link => {
      this.d3Nodes[this.getIndexByScopusId(link.source)].degree++
      this.d3Nodes[this.getIndexByScopusId(link.target)].degree++
      this.d3Links.push(new Link(link.source, link.target, link.collabStrength * 5))
    })
  }

  getIndexByScopusId(scopusId: any) {
    return this.apiNodes.map(node => node.scopusId).indexOf(scopusId)
  }

  downloadDataUrl(dataUrl: string, filename: string): void {
    let a = this.coreDoc.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    this.coreDoc.body.appendChild(a); //Firefox requires link to be in body
    a.click();
    this.coreDoc.body.removeChild(a);
  }

  onDownloadGraph(): void {
    const theElement = this.downloadEl.nativeElement;
    htmlToImage.toPng(theElement).then(dataUrl => {
      this.downloadDataUrl(dataUrl, `coauthor-graph-${this.author.scopusId}`);
    });
  }
}
