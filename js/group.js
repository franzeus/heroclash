var Group = function(name) {
  this.id = name;
  this.creatures = [];
  this.dead_creatures = 0;
  this.lead = null;
  this.bases = [];
};

Group.prototype.canBeAttacked = function() {
  return this.creatures.length > this.dead_creatures;
};

Group.prototype.attackedBy = function(group, creaturesGetKilled) {
  if (creaturesGetKilled && this.canBeAttacked()) {
    this.dead_creatures += creaturesGetKilled;
    console.log(this.id, ' was attacked by ', group.id, creaturesGetKilled, this.dead_creatures);
  } else {
    console.log(this.id, ' has no more creatures ', this.dead_creatures, ' or simply did not lose any');
  }
};

Group.prototype.add = function(creature) {
  this.creatures.push(creature);
  creature.group = this;
  return this;
};

Group.prototype.remove = function(creature) {
  this.dead_creatures++;
  return this;
};

