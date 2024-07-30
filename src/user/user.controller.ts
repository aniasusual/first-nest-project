import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from './request.interface';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    // @UseGuards(AuthGuard('jwt'))
    // @Get('me')
    // getMe(@Req() req: CustomRequest) {
    //     console.log({
    //         "this user": req.user,
    //     })
    //     return req.user
    // }

    //Cleaner way of doing above is 
    @Get('me')
    getMe(@GetUser('id') user: User) { // this will only pass the id of the user
        // getMe(@GetUser('') user: User) { //this will pass the whole user Object
        console.log({
            "this user": user,
        })
        return user
    }
}
