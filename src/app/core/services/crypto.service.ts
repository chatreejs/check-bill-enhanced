import { Injectable } from '@angular/core';
import { AES, enc, mode, pad } from 'crypto-js';

const config = {
  key: '3AR6Tz6nyoCzSDpWVpeo8A==',
  iv: 'SBEX94Kmcm2Wgr0yTpqb/okWyeO3yNOMY+ZB2DXFFSM=',
  keySize: 256,
};

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  encrypt(value: string): string {
    if (value == null) {
      return '';
    }

    const key = enc.Utf8.parse(config.key);
    const iv = enc.Utf8.parse(config.iv);
    const encrypted = AES.encrypt(value, key, {
      keySize: config.keySize / 32,
      iv: iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });

    return encrypted.toString();
  }

  decrypt(value: string): string {
    if (value == null) {
      return '';
    }

    const key = enc.Utf8.parse(config.key);
    const iv = enc.Utf8.parse(config.iv);
    const decrypted = AES.decrypt(value, key, {
      keySize: config.keySize / 32,
      iv: iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });

    return decrypted.toString(enc.Utf8);
  }
}
