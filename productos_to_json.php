<?php

   ablancodev_get_categories();

   function ablancodev_get_categories() {
      $result = [];

      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://tienda.mercadona.es/api/categories/');
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_HEADER, 0);
      curl_setopt($ch, CURLOPT_TIMEOUT, 60); 
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
      $data = curl_exec($ch);

      if (curl_errno($ch)) {
          echo 'Curl error: ' . curl_error($ch);
      }

      curl_close($ch);

      if ($data) {
         $categorias = json_decode($data);
         if (isset($categorias->results)) {
            foreach ($categorias->results as $category) {
                $category_info = ablancodev_get_subcategories($category, 1); 
                $result[] = $category_info;
            }
         }
      }

      file_put_contents('products_output.json', json_encode($result, JSON_PRETTY_PRINT));
      echo "Archivo JSON guardado como 'categories_output.json'.";
   }

   function ablancodev_get_subcategories($category, $level = 1) {
      $category_info = [
         'id' => $category->id,
         'name' => $category->name,
         'subcategories' => [],
         'products' => [] 
      ];

      if (isset($category->products) && is_array($category->products)) {
         foreach ($category->products as $product) {
            $category_info['products'][] = [
               'id' => $product->id,
               'name' => $product->display_name,
               'price' => $product->price_instructions->unit_price 
            ];
         }
      }

      if (isset($category->categories) && is_array($category->categories) && $level < 3) {
         foreach ($category->categories as $subcat) {
            $subcategory_info = [
               'id' => $subcat->id,
               'name' => $subcat->name,
               'subcategories' => ablancodev_get_category($subcat->id, $level + 1), 
               'products' => [] 
            ];

            if (isset($subcat->products) && is_array($subcat->products)) {
               foreach ($subcat->products as $product) {
                  $subcategory_info['products'][] = [
                     'id' => $product->id,
                     'name' => $product->display_name,
                     'price' => $product->price_instructions->unit_price
                  ];
               }
            }
            $category_info['subcategories'][] = $subcategory_info;
         }
      }
      return $category_info;
   }

   function ablancodev_get_category($category_id, $level = 1) {
      $subcategories = [];

      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, 'https://tienda.mercadona.es/api/categories/' . $category_id);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_HEADER, 0);
      curl_setopt($ch, CURLOPT_TIMEOUT, 60);
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
      $data = curl_exec($ch);

      if (curl_errno($ch)) {
          echo 'Curl error: ' . curl_error($ch);
      }

      curl_close($ch);

      if ($data) {
         $category = json_decode($data);
         if (isset($category->categories)) {
            foreach ($category->categories as $cat_info) {
               $subcategories[] = [
                  'id' => $cat_info->id,
                  'name' => $cat_info->name,
                  'subcategories' => ablancodev_get_category($cat_info->id, $level + 1), 
                  'products' => [] 
               ];

               if (isset($cat_info->products) && is_array($cat_info->products)) {
                  foreach ($cat_info->products as $product) {
                     $subcategories[count($subcategories) - 1]['products'][] = [
                        'id' => $product->id,
                        'name' => $product->display_name,
                        'price' => $product->price_instructions->unit_price
                     ];
                  }
               }
            }
         }
      }
      return $subcategories;
   }

?>
