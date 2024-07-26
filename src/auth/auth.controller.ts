import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

//Controller uses auth service and auth service returns something baack to the controller which is fed to the browser.
@Controller('auth')
export class AuthController {
  // constructor(){
  //     const service = new AuthService();
  // }

  //instead of doing above thing in nestjs we have another better way of doing above thing.
  constructor(private authService: AuthService) { }
  // @Post('signup')
  //   signup(@Req() req: Request) {
  //     console.log(req.body)
  //     return this.authService.signup(req.body)
  //   }

  //above is not a good practice because we dont have to use the Req object of the underlying library instead use @Body
  // signup(@Body() dto: AuthDto) {

  //   console.log({
  //       dto
  //   })

  //   return this.authService.signup()
  // }

  //we can do the above using pipe in nestjs as below
  // @Post('signup')
  // signup(
  //   @Body('email') email: string,
  //   @Body('password', ParseIntPipe) password: string, //instead of doing it like this we can directly put the pipe in authService
  // ) {
  //   //the parse int pipe will make sure that the password entered is integer only. Nothing else. Pipes in nestjs are used for datatype transformation.
  //   console.log({
  //     email,
  //     typeofEmail: typeof email,
  //     password,
  //     typeofPassword: typeof password,
  //   });

  //   return 'user signedUp';
  // }

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // console.log({
    //   dto
    // })
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  // another way of doing above is and is more messy

  // authService:AuthService
  // constructor(authService:AuthService){ // this is req because ts need to know what kind if datatype constructor can accept
  //     this.authService = AuthService
  // }
}
