const projectStatus = {
  PENDING: { description: "Pending Execution" },
  SUCCESS: { description: "Executed Successfully" },
  FAILURE: { description: "Execution Failed" }
};

class ProjectIdea {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.status = projectStatus.PENDING;
  }
  updateProjectStatus(newStatus) {
    this.status = newStatus;
  }
}

class ProjectIdeaBoard {
  constructor(title) {
    this.title = title;
    this.ideas = [];
  }
  pin(idea) {
  this.ideas.push(idea);
  }
  unpin(idea) {
    this.ideas = this.ideas.filter(item => item !== idea);
  }

  count() {
    return this.ideas.length;
  }

  formatToString() {
    let result = `${this.title} has ${this.count()} idea(s)\n`;
    for (let idea of this.ideas) {
      result += `${idea.title} (${idea.status.description}) - ${idea.description}\n`;
    }
    return result;
  }
}

const idea1 = new ProjectIdea(
  "Smart Window Locks",
  "An automation project allowing users to lock, unlock windows automatically based on weather conditions."
);

console.log(idea1);
console.log(idea1.status.description);

const board = new ProjectIdeaBoard("My Tech Projects");

const ideaA = new ProjectIdea("Smart Home System", "Controls lights and temperature.");
const ideaB = new ProjectIdea("Breakfast Chef Robot", "Prepares breakfast automatically.");

board.pin(ideaA);
board.pin(ideaB);

console.log(board.count()); // 2
console.log(board.ideas);