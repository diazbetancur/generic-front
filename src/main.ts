import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * Bootstrap de la aplicación (Angular 20 standalone)
 * Sin AppModule - Todo se configura en appConfig
 */
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
