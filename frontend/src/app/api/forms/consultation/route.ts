import { submitForm } from "../[formKey]/submissions/route";

export function POST(request: Request) {
  return submitForm(request, "consultation");
}
