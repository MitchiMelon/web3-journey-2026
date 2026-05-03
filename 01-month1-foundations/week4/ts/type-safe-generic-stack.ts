class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

const nameStack = new Stack<string>();

nameStack.push("Alice");
nameStack.push("Bob");
nameStack.push("Charlie");

console.log("Popped:", nameStack.pop());
console.log("Top after pop:", nameStack.peek());
console.log("Is empty?", nameStack.isEmpty());
console.log("Size:", nameStack.size());

const numberStack = new Stack<number>();
numberStack.push(42);
numberStack.push(99);
numberStack.push(7);
console.log("Popped number:", numberStack.pop());
