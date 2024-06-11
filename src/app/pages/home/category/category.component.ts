import { BrowserModule } from '@angular/platform-browser';
import { Category } from '../../../models/category';
import { CategoryService } from './../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgFor],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{

  public categories: Category[] = [];
  public categoriesAll: Category[] = [];

  constructor(private service: CategoryService){}

  ngOnInit(): void{
    this.findAll();
  }

  findAll(){
    this.service.findAll().subscribe(data => {
      this.categories = data;
      this.categoriesAll = data;
    });
  }

  search(event: Event){
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();
    this.categories = this.categoriesAll.filter(category => {
      return category.description.toLowerCase().includes(value);
    })
  }

}
