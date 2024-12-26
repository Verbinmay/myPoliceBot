import { Context, Scenes } from "telegraf";

export type ContextSceneType = Scenes.SceneContext &
  MyContext &
  Scenes.WizardContext;

interface MySceneContextScene extends Scenes.SceneContextScene<MyContext> {
  state: any;
}

export interface MyContext extends Context {
  scene: MySceneContextScene;
}
