// Where each artwork photo in public/images/ comes from: its Wikimedia
// Commons file page, where the author and licence can be checked. Paintings
// are faithful public-domain reproductions, except The Virgin and Child with
// Saint Anne and The Intervention of the Sabine Women, CC0 photos (Wilfredor,
// 2024); the sculpture photos are CC0.
// Files were downloaded at about 2000 px on the long edge and only resized
// or recompressed to stay light on phones (no crops, no filters).
//
// The credit shown on the site comes from the content JSON
// (artwork.imageCredit); the About page links each photo to this page.

export const IMAGE_SOURCE: Record<string, string> = {
  "mona-lisa":
    "https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
  "la-grande-odalisque":
    "https://commons.wikimedia.org/wiki/File:La_grande_odalisque_-_Jean-Auguste_Dominique_Ingres_-_Mus%C3%A9e_du_Louvre_Peintures_RF_1158.jpg",
  "venus-de-milo":
    "https://commons.wikimedia.org/wiki/File:V%C3%A9nus_de_Milo_-_Mus%C3%A9e_du_Louvre_AGER_LL_299_;_N_527_;_Ma_399.jpg",
  "winged-victory": "https://commons.wikimedia.org/wiki/File:Nike_of_Samothrace,_Paris,_Louvre.jpg",
  "liberty-leading-the-people":
    "https://commons.wikimedia.org/wiki/File:La_Libert%C3%A9_guidant_le_peuple_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_129_-_apr%C3%A8s_restauration_2024.jpg",
  "raft-of-the-medusa":
    "https://commons.wikimedia.org/wiki/File:Le_Radeau_de_la_M%C3%A9duse_-_Th%C3%A9odore_G%C3%A9ricault_-_Mus%C3%A9e_du_Louvre_Peintures_INV_4884_;_C_51.jpg",
  "death-of-sardanapalus":
    "https://commons.wikimedia.org/wiki/File:La_Mort_de_Sardanapale_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_2346.jpg",
  "virgin-of-the-rocks":
    "https://commons.wikimedia.org/wiki/File:Leonardo_Da_Vinci_-_Vergine_delle_Rocce_(Louvre).jpg",
  "virgin-and-child-with-saint-anne":
    "https://commons.wikimedia.org/wiki/File:The_Virgin_and_Child_with_Saint_Anne_by_Leonardo_da_Vinci,_Louvre.jpg",
  "wedding-feast-at-cana":
    "https://commons.wikimedia.org/wiki/File:Les_Noces_de_Cana_-_Paolo_Veronese_-_Mus%C3%A9e_du_Louvre_Peintures_INV_142_;_MR_384.jpg",
  "portrait-of-baldassare-castiglione":
    "https://commons.wikimedia.org/wiki/File:Baldassare_Castiglione,_by_Raffaello_Sanzio,_from_C2RMF_retouched.jpg",
  "coronation-of-napoleon":
    "https://commons.wikimedia.org/wiki/File:Le_Sacre_de_Napol%C3%A9on_-_Jacques-Louis_David_-_Mus%C3%A9e_du_Louvre_Peintures_INV_3699_;_MR_1437.jpg",
  "oath-of-the-horatii":
    "https://commons.wikimedia.org/wiki/File:Le_Serment_des_Horaces_-_Jacques-Louis_David_-_Mus%C3%A9e_du_Louvre_Peintures_INV_3692_;_MR_1432.jpg",
  "intervention-of-the-sabine-women":
    "https://commons.wikimedia.org/wiki/File:The_Intervention_of_the_Sabine_Women_-_David_(Louvre_INV_3691).jpg",
  "lady-of-auxerre":
    "https://commons.wikimedia.org/wiki/File:Dame_d%27Auxerre_-_Mus%C3%A9e_du_Louvre_AGER_MND_847_;_Ma_3098.jpg",
};
