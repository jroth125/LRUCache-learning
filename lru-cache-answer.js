class LRUCache {
    constructor(maxSize) {
      this.maxSize = maxSize || 1;
      this.cache = {};
      this.length = 0;
      this.list = new DoublyLinkedList();
    }
  
    insertKeyValuePair(key, value) {
      //check if in cache already
      if (!this.cache[key]) {
        let node = this.list.insertNewNode(key, value);
        this.cache[key] = node;
        this.length++;
      } else { //if it it, then move the corresponding node to the head of the list
        this.list.moveToHead(this.cache[key], value);
      }
      if (this.length > this.maxSize) { //now we check for size - if over the max, then we use our evict method
        let nodeToDelete = this.list.evict();
        let keyToGetRidOf = nodeToDelete.key;
        delete this.cache[keyToGetRidOf]; //also remember! We must get rid of the property in our hashmap so we can't use it again!
      }
    }
  
    getValueFromKey(key) {
      if (!this.cache[key]) return null;
      else { //if we have the key, we're going to move that node to the head with our list.moveToHead method
        let nodeToMove = this.cache[key];
        this.list.moveToHead(nodeToMove);
        return nodeToMove.value;
      }
    }
  
    getMostRecentKey() {
      return this.list.head ? this.list.head.key : null;
    }
  }
  
  class DoublyLinkedList { //our list that behaves a bit like a queue
    constructor() {
      this.head = null;
      this.tail = null;
    }
    insertNewNode(key, value) {
      let node = new Node(key, value)
      if (!this.head) { //check if there is a head. If not, the list is empty
        this.head = node;
        this.tail = node;
      } else { //if there are actually nodes in the list, you are free to insert one!
        this.head.prev = node;
        node.next = this.head;
        this.head = node;
      }
      return node; //we return this here to put the node in our cache
    }
  
    evict() {
      let nodeToDelete;
      if (this.head === this.tail) { //check for this edge case. If you happen to be evicting the head
        nodeToDelete = this.head;
        this.head = null;
        this.tail = null;
      } else { //pretty straightforward! Here, we're just deleting the tail
        nodeToDelete = this.tail;
        const prevNode = this.tail.prev;
        prevNode.next = null;
        this.tail = prevNode;
      }
      return nodeToDelete;
    }
    moveToHead(node, newValue) {
      //first edge case (if the node is the tail but NOT head --> if its the head we don't do anything right?)
      if (newValue) node.value = newValue; //if there is a newValue, then that means we are resetting the val
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
  