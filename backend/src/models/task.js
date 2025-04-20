const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O título não pode estar vazio'
        }
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
  }, {
    tableName: 'tasks',
    timestamps: true,
    hooks: {
      beforeCreate: (task) => {
        if (!task.description) {
          task.description = null;
        }
      }
    }
  });

  return Task;
};