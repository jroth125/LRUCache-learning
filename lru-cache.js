class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize || 1;
    this.cache = {};
    this.length = 0;
    this.list = new DoublyLinkedList();
  }

  insertKeyValuePair(key, value) {
    // Write your code here.
    //check if in cache already
    if (!this.cache[key]) {
      let node = this.list.insertNewNode(key, value);
      this.cache[key] = node;
      this.length++;
    } else {
      this.list.moveToHead(this.cache[key], value);
    }
    if (this.length > this.maxSize) {
      let nodeToDelete = this.list.evict();
      let keyToGetRidOf = nodeToDelete.key;
      delete this.cache[keyToGetRidOf];
    }
  }

  getValueFromKey(key) {
    // Write your code here.
    if (!this.cache[key]) return null;
    else {
      let nodeToMove = this.cache[key];
      this.list.moveToHead(nodeToMove);
      return nodeToMove.value;
    }
  }

  getMostRecentKey() {
    // Write your code here.
    return this.list.head ? this.list.head.key : null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  insertNewNode(key, value) {
    let node = new Node(key, value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return node;
  }

  evict() {
    let nodeToDelete;
    if (this.head === this.tail) {
      nodeToDelete = this.head;
      this.head = null;
      this.tail = null;
    } else {
      nodeToDelete = this.tail;
      const prevNode = this.tail.prev;
      prevNode.next = null;
      this.tail = prevNode;
    }
    return nodeToDelete;
  }
  moveToHead(node, newValue) {
    //first edge case (if the node is the tail but NOT head --> if its the head we don't do anything right?)
    if (newValue) node.value = newValue;
    if (node === this.tail && node !== this.head) {
      let prevNode = this.tail.prev;
      prevNode.next = null;
      this.tail = prevNode;
      node.prev = null;

      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    } else if (node !== this.head) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
  }
}

class Node {
  constructor(key, value) {
    this.value = value;
    this.key = key;
    this.next = null;
    this.prev = null;
  }
}

module.exports = LRUCache;
