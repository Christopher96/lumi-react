export class AddIconsToTree {
  append(tree: Tree, icon: (path: string[]) => any, path: string[]): Tree {
    if (tree.isLeaf) {
      return { ...tree, icon: icon(path) };
    } else {
      return {
        ...tree,
        children: tree.children.map(v =>
          this.append(v, icon, [...path, v.title])
        )
      };
    }
  }
  make([tree]: [Tree], icon: (path: string[]) => any) {
    if (!tree) return null;
    return [this.append(tree, icon, [])];
  }
}

export type Tree = Leaf | Branch;

export type Leaf = {
  title: string;
  key: string;
  isLeaf: true;
  icon: any;
};

export type Branch = {
  title: string;
  key: string;
  isLeaf: false;
  children: Tree[];
};
