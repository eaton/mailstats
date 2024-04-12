import { MboxMessage } from "../types.js";
import micromatch from 'micromatch';

type AddressLabels = Record<string, string | string[]>;

export function labelAddresses(input: MboxMessage, labelRules: AddressLabels) {
  for (const [label, rules] of Object.entries(labelRules)) {
    for (const [key, addresses] of Object.entries(input.participants)) {
      for (const i in addresses) {
        if (micromatch([addresses[i].address ?? '', addresses[i].name], rules).length) {
          input.participants[key][i].labels.push(label);
        }
      }
    }
  }
}
