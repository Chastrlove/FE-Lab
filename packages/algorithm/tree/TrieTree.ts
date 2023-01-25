class TrieTree {
  public root = new TrieNode();

  public insert(word) {
    if (!word) {
      return false;
    }
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!node.next[word[i]]) {
        node.next[word[i]] = new TrieNode();
      }
      node = node.next[word[i]];
    }
    node.isEnd = true;
    return true
  }

  public getCommonPrefix = ()=>{
    let node = this.root;
    let prefix = ""
    while(!node.isEnd){
      const keys = Object.keys(node.next);
      if(keys.length !==1){
        break
      }
      prefix= prefix + keys[0]
      node = node.next[keys[0]]
    }
    return prefix
  }
}

class TrieNode {
  public next = {};
  public isEnd = false;
}

const trie = new TrieTree()

trie.insert("");
trie.insert("b");
const prefix = trie.getCommonPrefix();
console.log(prefix)
