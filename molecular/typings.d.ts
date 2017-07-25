// Correcao temporaria para https://github.com/Microsoft/TypeScript/issues/16593
// TODO: Remover quando uma nova versao do rxjs sair (6.0)

import {Operator} from 'rxjs/Operator';
import {Observable} from 'rxjs/Observable';

declare module 'rxjs/Subject' {
  interface Subject<T> {
    lift<R>(operator: Operator<T, R>): Observable<R>;
  }
}