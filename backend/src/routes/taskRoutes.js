const express = require('express');
const { Op } = require('sequelize');

module.exports = (Task) => {
  const router = express.Router();

  // Middleware para validar o ID da tarefa
  const validateTaskId = async (req, res, next) => {
    const { id } = req.params;
    
    try {
      const task = await Task.findByPk(id);
      
      if (!task) {
        return res.status(404).json({ 
          error: 'Not Found', 
          message: 'Tarefa não encontrada' 
        });
      }
      
      req.task = task;
      next();
    } catch (error) {
      next(error);
    }
  };

  // GET /api/tasks - Listar todas as tarefas
  router.get('/', async (req, res, next) => {
    try {
      const { completed, search, sort = 'createdAt', order = 'DESC' } = req.query;
      
      // Construir as condições de busca
      const whereConditions = {};
      
      if (completed !== undefined) {
        whereConditions.completed = completed === 'true';
      }
      
      if (search) {
        whereConditions.title = {
          [Op.iLike]: `%${search}%`
        };
      }
      
      // Validar ordenação para evitar injeção SQL
      const validSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'];
      const validOrderValues = ['ASC', 'DESC'];
      
      const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
      const orderDirection = validOrderValues.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
      
      const tasks = await Task.findAll({
        where: whereConditions,
        order: [[sortField, orderDirection]],
      });
      
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  });

  // GET /api/tasks/:id - Obter uma tarefa específica
  router.get('/:id', validateTaskId, (req, res) => {
    return res.json(req.task);
  });

  // POST /api/tasks - Criar uma nova tarefa
  router.post('/', async (req, res, next) => {
    try {
      const { title, description, completed, priority, dueDate } = req.body;
      
      if (!title) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'O título é obrigatório' 
        });
      }
      
      const newTask = await Task.create({
        title,
        description,
        completed: completed !== undefined ? completed : false,
        priority: priority || 'medium',
        dueDate: dueDate || null,
      });
      
      return res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  });

  // PUT /api/tasks/:id - Atualizar uma tarefa existente
  router.put('/:id', validateTaskId, async (req, res, next) => {
    try {
      const { title, description, completed, priority, dueDate } = req.body;
      const task = req.task;
      
      // Atualizar os campos modificados
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (completed !== undefined) task.completed = completed;
      if (priority !== undefined) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;
      
      await task.save();
      
      return res.json(task);
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/tasks/:id - Excluir uma tarefa
  router.delete('/:id', validateTaskId, async (req, res, next) => {
    try {
      await req.task.destroy();
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
};