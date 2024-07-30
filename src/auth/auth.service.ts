import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark, PrismaClient } from '@prisma/client'
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async signup(dto: AuthDto) {
        //generate the password hash
        const hash = await argon.hash(dto.password);

        console.log("oda ets printed")
        try {
            //save the user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },

                //inorder to not return password use select
                // select: {
                //     id: true,
                //     email: true,
                //     createdAt: true
                // }
                //or
            })
            // delete user.hash;

            //return the saved user
            return user;
            return this.signToken(user.id, user.email)

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') { // error code in prisma for duplicate credentials
                    throw new ForbiddenException('Credentials taken')
                }
            }
        }

    }
    async signin(dto: AuthDto) {
        //find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        //if user does not exist throw exception
        if (!user) throw new ForbiddenException('Credentials incorrect')

        //compare password
        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
        )
        //if password incorrect throw exception
        if (!pwMatches)
            throw new ForbiddenException(
                'Credentials incorrect');

        delete user.hash;

        //send back the user
        return this.signToken(user.id, user.email)

    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> { // this means that we are returning a promise here
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '48h',
            secret: secret
        })

        return {
            access_token: token
        }
    }
}