import boom from '@hapi/boom';

const scopesValidationHandler = (allowedScopes: any) => {
  return (req: any, res: any, next: any) => {

    if (!req.user && ( req.user || !req.user.scopes )) {
      next(boom.unauthorized('Missing scopes'));
    }

    const hasAccess = allowedScopes.map((allowedScopes: any) => req.user.scopes.includes(allowedScopes) )
    .find((allowed: any) => Boolean(allowed) );

    if (hasAccess) {
      next();
    } else {
      next(boom.unauthorized('Insufficients scopes'));
    }
  }
}

export default scopesValidationHandler;