const CategoryTable = {
    oninit: (vnode) => {
     
      vnode.state.categories = [];
      vnode.state.loading = true;
      vnode.state.page = 1;
      vnode.state.categoriesPerPage = 10; 
  

      m.request({
        method: "GET",
        url: `products_output.json?page=${vnode.state.page}&limit=${vnode.state.categoriesPerPage}`, 
      })

      .then((result) => {
        console.log(result)
        vnode.state.categories = result;
        vnode.state.loading = false;  
        m.redraw(); 
      })

      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        vnode.state.categories = []; 
        vnode.state.loading = false; 
        m.redraw();  
      });

    },
  
    loadMore: (vnode) => {
      
      vnode.state.page++;
      vnode.state.loading = true;
      
      m.request({
        method: "GET",
        url: `products_output.json`, 
      })

      .then((result) => {
        vnode.state.categories = vnode.state.categories.concat(result); 
        vnode.state.loading = false;
        m.redraw();  
      })

      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        vnode.state.loading = false;
        m.redraw(); 
      });

    },
  
    view: (vnode) => {

      if (vnode.state.loading) {
        return m("div", "Cargando datos...");
      }
  
      const renderCategory = (category) => {

        return m("li", [

          m("h1", category.name), 

          category.subcategories.length > 0 

            ? m("div", [

                m("h2", "Subcategorías:"),

                m("ul", category.subcategories.map(subcategory => {

                  return m("li", [

                    m("h3", subcategory.name),

                    subcategory.subcategories.length > 0 

                      ? m("ul", subcategory.subcategories.map(subsubcategory =>

                          m("li", [

                            m("h4", subsubcategory.name),
                            m("ul", subsubcategory.products.map((product,index)=> [

                              index%2==0 
                              ? m("li", {style:{backgroundColor:"#f2f2f2",padding:"10px 0px"}},`${product.name}: `, m("span",{style:{fontWeight:"bold"}}, `${product.price}€`)) 
                              : m("li",{style:{padding:"10px 0px"}}, `${product.name}: `, m("span",{style:{fontWeight:"bold"}}, `${product.price}€`)),
                              m("hr")
                            ]
                            )),
                          ])
                        ))
                      : null
                  ]);
              }))
              
              ])
            : m("span", "Sin subcategorías") 
        ]);
      };
  
      const categories = vnode.state.categories;
  
      return m("div", [
        
        m("h1",{style:{textAlign:"center"}}, "Lista de Categorías y Productos"),
        m("ul", categories.length > 0 

          ? categories.map(renderCategory)
          : m("li", "No hay datos disponibles")

        ),
        m("button", {

          onclick: () => vnode.state.loading ? null : vnode.loadMore(vnode)
          
        }, vnode.state.loading ? "Cargando..." : "Cargar más")
      ]);
    }
  };
  
  m.mount(document.body, CategoryTable);
  