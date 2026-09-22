// Les descriptions de PokeAPI viennent des jeux : elles contiennent les
// retours à la ligne des boîtes de dialogue et des césures optionnelles.
export function cleanFlavorText(text: string): string {
  return text
    .replace(/­/g, "")
    .replace(/[\n\f\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
