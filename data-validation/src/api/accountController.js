import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import writeServerJsonResponse from "../utils/utils";
import ApiError from "../error/ApiError";
import AccountsDAO from "../dao/accountsDAO";

const hashPassword = async (password) => await bcrypt.hash(password, 10);

export class Account {
  constructor({ username, email, password, role } = {}) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }
  toJson() {
    return {
      username: this.username,
      email: this.email,
      role: this.role,
    };
  }
  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.password);
  }
  encoded() {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        ...this.toJson(),
      },
      process.env.SECRET_KEY
    );
  }
  static async decoded(userJwt) {
    return jwt.verify(userJwt, process.env.SECRET_KEY, (error, res) => {
      if (error) {
        return { error };
      }
      return new User(res);
    });
  }
}
export default class UserController {
  static async signup(req, res, next) {
    try {
      const userFromBody = req.body;
      const { email, username } = userFromBody;
      const email_result = await AccountsDAO.getUserByEmail(email);
      const username_result = await AccountsDAO.getUserByUsername(username);
      if (email_result) {
        next(ApiError.conflict("Email is already taken."));
        return;
      } else if (username_result) {
        next(ApiError.conflict("Username is already taken."));
        return;
      } else {
        const userInfo = {
          ...userFromBody,
          password: await hashPassword(userFromBody.password),
        };
        const insertResult = await AccountsDAO.addUser(userInfo);
        const userFromDb = {
          username: insertResult.data.username,
          email: insertResult.data.email,
          password: insertResult.data.password,
        };
        const account = new Account(userFromDb);
        const data = {
          auth_token: account.encoded(),
          info: account.toJson(),
        };
        writeServerJsonResponse(res, data, insertResult.statusCode);
      }
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const userData = await AccountsDAO.getUserByUsername(username);
      if (!userData) {
        next(ApiError.unauthorized("Make sure your username is correct."));
        return;
      }
      const user = new Account(userData);
      if (!(await user.comparePassword(password))) {
        next(ApiError.unauthorized("Make sure your password is correct."));
        return;
      }
      const data = { auth_token: user.encoded(), info: user.toJson() };
      writeServerJsonResponse(res, data, 200);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }

  static async delete(req, res, next) {
    try {
      const { password } = req.body;
      const decoded_user = req.jwt;
      const user = new Account(
        await AccountsDAO.getUserByEmail(decoded_user.email)
      );
      if (!(await user.comparePassword(password))) {
        next(ApiError.unauthorized("Make sure your password is correct."));
        return;
      }
      const deleteResult = await AccountsDAO.deleteUser(decoded_user.email);
      const { error } = deleteResult;
      if (error) {
        next(ApiError.internal(error));
        return;
      }
      writeServerJsonResponse(res, deleteResult, 200);
    } catch (e) {
      next(ApiError.internal(`Something went wrong: ${e.message}`));
      return;
    }
  }
}
