export type Tree = Leaf | Branch;

export type Leaf = {
  title: string;
  key: string;
  isLeaf: true;
};

export type Branch = {
  title: string;
  key: string;
  isLeaf: false;
  children: Tree[];
};

