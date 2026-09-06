FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs frontend/.next/standalone ./
COPY --chown=nextjs:nodejs frontend/.next/static ./frontend/.next/static
COPY --chown=nextjs:nodejs frontend/public ./frontend/public

RUN find /app/frontend/.next/node_modules -type l -print0 \
  | while IFS= read -r -d '' link; do \
      target="$(readlink "$link")"; \
      ln -snf "/app/frontend/${target#*frontend/}" "$link"; \
    done

RUN mkdir -p /app/media /app/private-media \
  && chown -R nextjs:nodejs /app/media /app/private-media

USER nextjs
EXPOSE 3000
CMD ["node", "frontend/server.js"]
