// tests/auth.test.js
const Auth = require('../api/auth/auth.database');
const bcrypt = require('bcrypt');
const { Sequelize, QueryTypes } = require('sequelize');
const models = require('../models'); 

jest.mock('../models', () => ({
  sequelize: {
    query: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('Auth Class', () => {
  describe('getLoggedUser', () => {
    it('should return user data if email and password match', async () => {
      const mockUser = { user_id: 1, name: 'Test User', password: '$2b$10$hashedpassword' };
      bcrypt.compare.mockResolvedValue(true); // Simulamos que la comparación de la contraseña es exitosa
      models.User.findOne.mockResolvedValue(mockUser); // Simulamos que se encuentra el usuario

      const result = await Auth.getLoggedUser('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
    });

    it('should return null if user is not found or password is incorrect', async () => {
      models.User.findOne.mockResolvedValue(null); // No se encuentra el usuario
      bcrypt.compare.mockResolvedValue(false); // La contraseña no coincide

      const result = await Auth.getLoggedUser('nonexistent@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should throw an error if there is a database issue', async () => {
      models.User.findOne.mockRejectedValue(new Error('Database error'));

      await expect(Auth.getLoggedUser('test@example.com', 'password123')).rejects.toThrow('Database error');
    });
  });

  describe('emailExists', () => {
    it('should return user if email exists', async () => {
      const mockUser = { user_id: 1, name: 'Test User', email: 'test@example.com' };
      models.User.findOne.mockResolvedValue(mockUser);

      const result = await Auth.emailExists('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      models.User.findOne.mockResolvedValue(null);

      const result = await Auth.emailExists('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should throw an error if there is a database issue', async () => {
      models.User.findOne.mockRejectedValue(new Error('Database error'));

      await expect(Auth.emailExists('test@example.com')).rejects.toThrow('Database error');
    });
  });

  describe('getRoles', () => {
    it('should return user roles', async () => {
      const mockRoles = [{ role_id: 1, role_name: 'admin' }];
      models.sequelize.query.mockResolvedValue(mockRoles);

      const result = await Auth.getRoles(1);
      expect(result).toEqual(mockRoles);
    });

    it('should throw an error if there is a database issue', async () => {
      models.sequelize.query.mockRejectedValue(new Error('Database error'));

      await expect(Auth.getRoles(1)).rejects.toThrow('Database error');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = { name: 'Test User', first_surname: 'Doe', second_surname: 'Smith', email: 'test@example.com', password: 'password123' };
      bcrypt.hash.mockResolvedValue('$2b$10$hashedpassword'); 
      models.sequelize.query.mockResolvedValue([1]); // Simulamos que se inserta el usuario y se obtiene un ID

      const result = await Auth.register(mockUser);
      expect(result).toBe(1); // Verificamos que el ID del usuario se devuelve
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should throw an error if there is a database issue', async () => {
      const mockUser = { name: 'Test User', first_surname: 'Doe', second_surname: 'Smith', email: 'test@example.com', password: 'password123' };
      bcrypt.hash.mockResolvedValue('$2b$10$hashedpassword');
      models.sequelize.query.mockRejectedValue(new Error('Database error'));

      await expect(Auth.register(mockUser)).rejects.toThrow('Database error');
    });
  });
});
