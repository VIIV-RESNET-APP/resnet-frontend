import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Author} from "../../interfaces/author.interface";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ArticleService} from "../../services/article.service";
import {Article} from "../../interfaces/article.interface";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-author-profile',
  templateUrl: './author-profile.component.html',
  styleUrls: ['./author-profile.component.scss']
})
export class AuthorProfileComponent {

  author!: Author
  article!: Article

  showCoauthorsGraph: boolean = false

  faCircleInfo = faCircleInfo

  constructor(private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private articleService: ArticleService) {
    this.setAuthor()
  }

  setAuthor() {
    const {author} = this.activatedRoute.snapshot.data
    if (!author) return;
    this.author = {...author}
    if(this.author.email === "0") this.author.email = "Email no disponible";
  }

  openModal(content: any, articleId: number) {
    this.articleService.getArticleById(articleId).subscribe((ar: Article) => {
      this.article = ar
      this.modalService.open(content, {scrollable: true, size: "lg", centered: true}).result.then(
        (result) => {
          console.log("result", result)
        },
        (reason) => {
          console.log("reason", reason)
        },
      );
    })
  }

  getTopicFontSize(x: number) {
    let a = 1.25, b = 2.25, min = 1, max = this.author.topics.length
    return (b - a) * (x - min) / (max - min) + a + 'em'
  }

}
