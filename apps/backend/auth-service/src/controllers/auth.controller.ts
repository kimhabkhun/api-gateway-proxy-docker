import { loginWithGoogle } from "@/services/login-google.service";
import { Controller, Route, Get, Tags, Post, Body, Request } from "tsoa";
import express from "express";
import authService from "@/services/auth.service";
import { setCookies } from "@/utils/cookies";
import {
  SignInRequest,
  SignUpRequest,
  VerifyUserRequest,
} from "./types/auth.types";

@Route("/auth")
export class AuthController extends Controller {
  constructor() {
    super();
  }
  @Get("/link")
  @Tags("google link")
  public async getLink() {
    try {
      const link = loginWithGoogle();
      return { link: link };
    } catch (error) {
      // console.log("error,,,,,,,,,,,,,,,,,,,,,,,,,,,,");

      throw error;
    }
  }
  @Post("/signup")
  @Tags("SignUp")
  async signup(
    @Body() reqBody: SignUpRequest
  ): Promise<{ message: string; required?: string }> {
    try {
      await authService.signup(reqBody);
      return {
        message: "Success Register!",
        required: "Please Confirm Verificatino",
      };
    } catch (error) {
      //@ts-ignore
      if (error.name === "UsernameExistsException") {
        this.setStatus(403);
        return { message: "User already exist!" };
      } else {
        throw error;
      }
    }
  }
  @Post("/confirmSignup")
  @Tags("Confirm SignUp")
  async confirmSignup(@Body() reqBody: VerifyUserRequest) {
    try {
      await authService.confirmSignup(reqBody);
      return {
        message: "Success Verify! You can now Logged in",
      };
    } catch (error) {
      throw error;
    }
  }
  @Post("/login")
  @Tags("Login")
  async login(@Body() reqBody: SignInRequest, @Request() req: express.Request) {
    try {
      const tokens = await authService.login(reqBody);
      const tokenParams = {
        token_id: tokens?.IdToken!,
        token_access: tokens?.AccessToken!,
        refresh_token: tokens?.RefreshToken!,
      };
      const res = req.res as express.Response;
      // console.log(tokens);
      setCookies(res, tokenParams);
      return {
        message: "Loggined Success!",
      };
    } catch (error) {
      throw error;
    }
  }
  @Get("/getCookies")
  @Tags("Tokens/Cookies")
  async getCookies(@Request() req: express.Request) {
    try {
      const reqBody: SignInRequest = {
        username: "kimhab",
        password: "Mrkimhab20@",
      };
      const tokens = await authService.login(reqBody);
      const tokenParams = {
        token_id: tokens?.IdToken!,
        token_access: tokens?.AccessToken!,
        refresh_token: tokens?.RefreshToken!,
      };
      const res = req.res as express.Response;
      // console.log(tokens);
      setCookies(res, tokenParams);
      return {
        message: "Loggined Success!",
      };
    } catch (error) {
      throw error;
    }
  }
}
