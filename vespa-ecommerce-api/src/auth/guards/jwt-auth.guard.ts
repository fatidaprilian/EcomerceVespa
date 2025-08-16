// file: src/auth/guards/jwt-auth.guard.ts

import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Jika endpoint ditandai @Public, langsung izinkan
    }
    
    // Jika tidak, lanjutkan proses verifikasi token oleh AuthGuard
    return super.canActivate(context);
  }

  // ✅ KUNCI PERBAIKAN: Override metode ini
  // Ini memastikan guard tidak melempar error jika tidak ada token,
  // sehingga 'req.user' akan menjadi 'null' dan endpoint publik tetap jalan.
  handleRequest(err, user, info) {
    if (err) {
      throw err;
    }
    // Kembalikan user jika token valid, atau null jika tidak ada token
    return user;
  }
}