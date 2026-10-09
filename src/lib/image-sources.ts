// Where each artwork photo in public/images/ comes from: its Wikimedia
// Commons file page, where the author and licence can be checked. Paintings
// are faithful public-domain reproductions; the sculpture photos are CC0.
// Files were downloaded at about 2000 px on the long edge and only resized
// or recompressed to stay light on phones (no crops, no filters).
//
// The credit shown on the site comes from the content JSON
// (artwork.imageCredit); the About page links each photo to this page.

export const IMAGE_SOURCE: Record<string, string> = {
  "mona-lisa":
    "https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
  "venus-de-milo":
    "https://commons.wikimedia.org/wiki/File:V%C3%A9nus_de_Milo_-_Mus%C3%A9e_du_Louvre_AGER_LL_299_;_N_527_;_Ma_399.jpg",
  "winged-victory": "https://commons.wikimedia.org/wiki/File:Nike_of_Samothrace,_Paris,_Louvre.jpg",
  "liberty-leading-the-people":
    "https://commons.wikimedia.org/wiki/File:La_Libert%C3%A9_guidant_le_peuple_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_129_-_apr%C3%A8s_restauration_2024.jpg",
  "raft-of-the-medusa":
    "https://commons.wikimedia.org/wiki/File:Le_Radeau_de_la_M%C3%A9duse_-_Th%C3%A9odore_G%C3%A9ricault_-_Mus%C3%A9e_du_Louvre_Peintures_INV_4884_;_C_51.jpg",
};
