import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: "", component: MainLayoutComponent, children: [
    { path: ":id", component: ChatComponent}
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})

export class AppRoutingModule {}
