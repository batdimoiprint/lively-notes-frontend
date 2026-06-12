export interface Tasks {
  _id: string;
  title: string;
  body: string;
  sectionId?: string;
}

export interface Inputs {
  title: string;
  body: string;
  sectionId?: string;
}
