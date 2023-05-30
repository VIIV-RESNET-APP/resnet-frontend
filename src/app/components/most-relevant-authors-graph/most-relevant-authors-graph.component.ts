import {Component, ElementRef, EventEmitter, Inject, Input, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Link, Node} from "../../d3";
import {AuthorNode, Coauthors} from "../../interfaces/author.interface";
import {AuthorService} from "../../services/author.service";
import {tap} from "rxjs";

import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {DOCUMENT} from "@angular/common";
import * as htmlToImage from "html-to-image";

@Component({
  selector: 'app-most-relevant-authors-graph',
  templateUrl: './most-relevant-authors-graph.component.html',
  styleUrls: ['./most-relevant-authors-graph.component.scss']
})
export class MostRelevantAuthorsGraphComponent {

  @Input() query: string
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>()

  d3Nodes: Node[]
  d3Links: Link[]

  apiNodes: AuthorNode[]

  forces: { manyBody: number, collide: number } = {manyBody: 1, collide: 50}

  showGraph: boolean = false

  authorsNumber: number = 50
  affiliations: { scopusId: number, name: string }[] = []
  selectedAffiliations: number[] = []

  @ViewChild("downloadEl") downloadEl: ElementRef;
  faDownload = faDownload

  constructor(private authorService: AuthorService,
              @Inject(DOCUMENT) private coreDoc: Document) {
  }

  ngOnInit() {
    this.refreshGraph()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query'] && !changes['query'].firstChange) {
      this.refreshGraph()
    }
  }

  refreshGraph() {
    this.showGraph = false
    this.loading.emit(true)
    this.authorService.getMostRelevantAuthors(this.query, this.authorsNumber)
      .pipe(
        tap((coauthors) => {
          this.affiliations = coauthors.affiliations;
          this.setupGraph(coauthors);
          this.showGraph = true;
          this.loading.emit(false);
        })
      ).subscribe();
  }

  setupGraph(coauthors: Coauthors) {
    this.apiNodes = coauthors.nodes
    this.d3Nodes = this.getD3Nodes()
    this.d3Links = this.getD3Links(coauthors.links)
  }

  onAuthorsNumberChange() {
    this.selectedAffiliations = []
    this.refreshGraph()
  }

  onClickCheckbox(event: any) {
    let item = Number(event.target.id)
    if (event.target.checked) {
      this.selectedAffiliations.push(item)
    } else {
      this.selectedAffiliations.splice(this.selectedAffiliations.indexOf(item), 1)
    }
  }

  onClickAffiliationsFilter(type: string) {
    this.showGraph = false
    this.loading.emit(true)
    this.authorService.getMostRelevantAuthors(this.query, this.authorsNumber, type, this.selectedAffiliations)
      .pipe(
        tap((coauthors) => {
          this.setupGraph(coauthors);
          this.showGraph = true;
          this.loading.emit(false);
        })
      ).subscribe();

  }

  getD3Nodes() {
    return this.apiNodes.map((node, index) => {
      return new Node(node.scopusId, this.apiNodes.length, node.initials, {
        enablePopover: true,
        title: 'Autor',
        content: node.firstName + " " + node.lastName,
        link: 'author/' + node.scopusId
      }, this.apiNodes.length - index)
    })
  }

  getD3Links(links: { source: number, target: number, collabStrength: number }[]) {
    return links.map(link => {
      this.d3Nodes[this.getIndexByScopusId(link.source)].degree++
      this.d3Nodes[this.getIndexByScopusId(link.target)].degree++
      return new Link(link.source, link.target, link.collabStrength * (4 + 1))
    })
  }

  getIndexByScopusId(scopusId: any) {
    return this.apiNodes.map(node => node.scopusId).indexOf(scopusId)
  }

  downloadDataUrl(dataUrl: string, filename: string): void {
    let a = this.coreDoc.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    this.coreDoc.body.appendChild(a);
    a.click();
    this.coreDoc.body.removeChild(a);
  }

  onDownloadGraph(): void {
    const theElement = this.downloadEl.nativeElement;
    htmlToImage.toPng(theElement).then(dataUrl => {
      this.downloadDataUrl(dataUrl, `most-relevant-authors-graph-${this.query}`);
    });
  }
}
