var Creature = function(options) {
  this.id = getRandomId();
  options = options || {};
  this.group = null;
  this.type = 'CREATURE';
  this.isDead = false;
  extend(this, options);
  this.element = jQuery('#creature_template').clone();
  this.element.removeClass('template');
};

Creature.prototype.setDead = function() {
  this.element.addClass('dead_creature');
  this.isDead = true;
};
