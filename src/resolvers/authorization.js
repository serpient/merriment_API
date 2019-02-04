import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

/*
The isAuthenticated() resolver function acts as middleware, either continuing 
with the next resolver (skip), or performing another action, like returning an 
error. In this case, an error is returned when the me user is not available. 
Since it is a resolver function itself, it has the same arguments as a normal 
resolver. A guarding resolver can be used when a message is created in the 
src/resolvers/message.js file. Import it with the combineResolvers() from the 
newly installed node package. The new resolver is used to protect the resolvers 
by combining them.
*/
export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');



export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role }}) => 
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin.')
)

export const isMessageOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const message = await models.Message.findById(id, { raw: true });

  if (message.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as message owner');
  }

  return skip;
}