<?php

    global $cant_prod;
    global $precio_total;
   ablancodev_get_categories();

   function ablancodev_get_categories() {
    global $cant_prod;
    global $precio_total;
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://tienda.mercadona.es/api/categories/'); 
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
      curl_setopt($ch, CURLOPT_HEADER, 0); 
      $data = curl_exec($ch); 
      curl_close($ch); 

      if ( $data ) {
         $categorias = json_decode($data);
        //  print_r($categorias);
         if ( isset($categorias->results) ) {
            echo '<ul>';
            foreach ( $categorias->results as $category ) {
                        echo '<ul>';
                        echo '<li><h1>ID ' . $category->id . ': ' . $category->name . '</h1></li>';
                        ablancodev_get_subcategories($category);
                        echo '</ul>';
            }
            echo '</ul>';
            echo '<p>Total de productos: ' . $cant_prod . '</p>';
            echo '<p>Precio total: ' . $precio_total . '€</p>';
         }
      }
   }
   function ablancodev_get_subcategories($category) {
    if (isset($category->categories) && is_array($category->categories)) {
        echo '<ul>';
        foreach ($category->categories as $subcat) {
            echo '<li><b>ID ' . $subcat->id . ': ' . $subcat->name . '</b></li>';

            // Si la subcategoría tiene más niveles, llamamos recursivamente
            ablancodev_get_category($subcat->id);
        }
        echo '</ul>';
    }
}

   function ablancodev_get_category( $category_id ) {
    global $cant_prod;
    global $precio_total;
        $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://tienda.mercadona.es/api/categories/' . $category_id); 
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
      curl_setopt($ch, CURLOPT_HEADER, 0); 
      $data = curl_exec($ch); 
      curl_close($ch); 
      if ( $data ) {
         echo '<ul>';
         $category = json_decode($data);
         if ( isset($category->categories) ) {
            foreach ( $category->categories as $cat_info ) {
               echo '<li><b>ID: ' . $cat_info->id . ': ' . $cat_info->name . '</b></li>';
               if ( isset($cat_info->products) ) {
                  foreach ( $cat_info->products as $product ) {
                        $cant_prod++;
                        $precio_total += $product->price_instructions->unit_price;
                  }
               } 

               ablancodev_get_category($cat_info->id);
            }
         }
         echo '</ul>';
      }
   }
?>
