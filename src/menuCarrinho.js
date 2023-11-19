import { catalogo, salvarLocalStorage, lerLocalStorage } from "./utilidades";

const idProdutoCarrinhoComQuantidade = lerLocalStorage(`carrinho`) ?? {};

function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("right-[0px]");
  document.getElementById("carrinho").classList.remove("right-[-360px]");
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("right-[0px]");
  document.getElementById("carrinho").classList.add("right-[-360px]");
}

function irparaCheckout(){
  if(Object.keys(idProdutoCarrinhoComQuantidade).length === 0){
    return;
  }
  window.location.href = window.location.origin + "./checkout.html";
}

export function inicializarCarrinho() {
  const botaoFecharCarrinho = document.getElementById("fechar-carrinho");
  const botaoAbrirCarrinho = document.getElementById("abrir-carrinho");
  const botaoIrParachekout = document.getElementById("finalizar-compras");

  botaoFecharCarrinho.addEventListener("click", fecharCarrinho);
  botaoAbrirCarrinho.addEventListener("click", abrirCarrinho);
  botaoIrParachekout.addEventListener("click",irparaCheckout);
}


function removerDoCarrinho(idProduto){
  delete idProdutoCarrinhoComQuantidade[idProduto];
  salvarLocalStorage(`carrinho`,idProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  renderizarProdutosCarrinho();
}

function IncrementarQuantidadeProduto(idProduto){
  idProdutoCarrinhoComQuantidade[idProduto]++;
  salvarLocalStorage(`carrinho`,idProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  atualizarInformacaoQuantidade(idProduto);
}

function decrementarQuantidadeProduto(idProduto){
  if(idProdutoCarrinhoComQuantidade[idProduto] === 1){

    removerDoCarrinho(idProduto);
    return;
  }
  idProdutoCarrinhoComQuantidade[idProduto]--;
  salvarLocalStorage(`carrinho`,idProdutoCarrinhoComQuantidade);
  atualizarPrecoCarrinho();
  atualizarInformacaoQuantidade(idProduto);
}

function atualizarInformacaoQuantidade(idProduto){
  document.getElementById(`quantidade-${idProduto}`).innerText = 
  idProdutoCarrinhoComQuantidade[idProduto];
}

function desenhaProdutoNoCarrinho(idProduto){

  const produto = catalogo.find((p) => p.id === idProduto);
  const containerProdutosCarrinho =
    document.getElementById("produtos-carrinho");

  const elementoArticle = document.createElement("article"); //<article></article>
  const articleClasses=["flex","bg-slate-100","rounded-lg", "p-1","relative"];

  for(const articleClass of articleClasses){
    elementoArticle.classList.add(articleClass);
  }

  const cartaoProdutoCarrinho = 
  `<button id="remover-item-${produto.id}" class="absolute top-0 right-2">
    <i class="fa-solid fa-circle-xmark text-slate-500 hover:text-slate-800"></i>
    </button>
    <img
      src="./assets/img/${produto.imagem}"
      alt="Carrinho: ${produto.nome}"
      class="h-24 rounded-lg"
    />
    <div class="p-2 felx flex-col justify-between">
      <p class="text-slate-900 text-sm">
        ${produto.nome}
      </p>
      <p class="text-slate-400 text-xs">Tamanho: M</p>
      <p class="text-green-700 text-lg">$${produto.preco}</p>
    </div>
    <div class='flex text-slate-950 items-end absolute bottom-0 right-2 text-lg'>
      <button id = 'decrementar-produto-${produto.id}'>-</button>
      <p id='quantidade-${produto.id}' class='ml-2'>
      ${idProdutoCarrinhoComQuantidade[produto.id]}</P>
      <button  class='ml-2'id = 'incrementar-produto-${produto.id}' >+</button>
    </div>`;

    elementoArticle.innerHTML = cartaoProdutoCarrinho;
    containerProdutosCarrinho.appendChild(elementoArticle) ;

  document.getElementById(`decrementar-produto-${produto.id}`).addEventListener('click', () => decrementarQuantidadeProduto(produto.id));
  document.getElementById(`incrementar-produto-${produto.id}`).addEventListener('click', () => IncrementarQuantidadeProduto(produto.id));

  document.getElementById(`remover-item-${produto.id}`).addEventListener("click", () => removerDoCarrinho(produto.id));
}


export function renderizarProdutosCarrinho(){
  const containerProdutosCarrinho =
  document.getElementById("produtos-carrinho");
  containerProdutosCarrinho.innerHTML ="";
  
  for(const idProduto in idProdutoCarrinhoComQuantidade){
   desenhaProdutoNoCarrinho(idProduto);
  }
}


export function adicionarAoCarrinho(idProduto) {
 if(idProduto in idProdutoCarrinhoComQuantidade){
  IncrementarQuantidadeProduto(idProduto); 
  return;
 }
  idProdutoCarrinhoComQuantidade[idProduto] = 1; 
  salvarLocalStorage(`carrinho`,idProdutoCarrinhoComQuantidade);
  desenhaProdutoNoCarrinho(idProduto);
  atualizarPrecoCarrinho();
}

export function atualizarPrecoCarrinho() {
 const precoCarrinho = document.getElementById("preco-total");
 let precoTotalCarrinho = 0 ;
 for(const idProdutonoCarrinho in idProdutoCarrinhoComQuantidade){
  precoTotalCarrinho += catalogo.find((p) => p.id === idProdutonoCarrinho).preco*idProdutoCarrinhoComQuantidade [idProdutonoCarrinho];
}
precoCarrinho.innerText=`Total:$${precoTotalCarrinho}`;
}
