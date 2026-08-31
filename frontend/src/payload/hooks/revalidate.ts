import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

function invalidate() {
  // Payload hooks also run from CLI seed/migration scripts, where Next's
  // request cache context does not exist. Database writes must still succeed.
  try {
    revalidateTag("payload-content", "max");
    revalidatePath("/", "layout");
  } catch {
    // The next web request will populate the cache from the migrated records.
  }
}

export const revalidateContent: CollectionAfterChangeHook = () => {
  invalidate();
};

export const revalidateDeletedContent: CollectionAfterDeleteHook = () => {
  invalidate();
};

export const revalidateGlobal: GlobalAfterChangeHook = () => {
  invalidate();
};
