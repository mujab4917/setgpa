# University logos

Put logo image files here, for example `fast.png`.

Then set the university's `logoUrl` in `prisma/seed.ts` (or directly in Prisma
Studio) to the path **as the browser sees it**, without the `public` part:

```
/logos/fast.png
```

When `logoUrl` is empty the card shows the university's initials instead, so
logos are entirely optional.
