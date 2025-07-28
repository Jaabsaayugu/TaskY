"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
function checkUsernameAndEmailReuse(req, res, next) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const { username, email } = req.body;
      const userWithSameDetails = yield client.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });
      if (userWithSameDetails) {
        res
          .status(400)
          .json({ message: "Email or Username is already being used" });
        return;
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Database error occurred." });
    }
  });
}
exports.default = checkUsernameAndEmailReuse;
