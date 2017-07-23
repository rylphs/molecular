Proposal:
```javascript
import { MolecularApp, PathEntry } from "app/support/molecular/molecular-app";
import { WindowConfig } from "app/support/molecular/window-manager";

var HomeComponent, ImageThumbComponent,
    ImageDetailComponent, Configure,
    Service, ListenTo, Fires, Params, WalkTo;

class EventManager { }

//Should support hierarchy?
export var Events = {//exporting to use outside
    FOLDER: {
        CHOOSE: {},
        CHOOSEN: {},
        LOADED: {}
    },
    OPEN_FOLDER: {},

    IMAGE: {
        SHOW_IMAGE: {}, CHANGE_IMAGE: {}, SELECTED: {},
        LIST_ALL: {}, SHOWIMAGE: {}, SELECT_OTHER: {}
    }
};

export var Windows:WindowConfig = {//Set up all app windows. Can fire events? (e.g: close)
    main: {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
    },
    openFolderDialog: {//Dialogs can fire and be shown on events
        type: "dialog", listenTo: Events.FOLDER.CHOOSE, 
        fires: Events.FOLDER.CHOOSEN
    },
    image_detail: { parent: Windows.main, modal: true }
};

export var Paths:PathEntry = [ //binds a angular path, to a window and a component
    { path: 'main', window: Windows.main, 
        menu: Menus.mainMenu, component: HomeComponent },
    {
        path: "image/:image", window: Windows.image_detail,
        menu: Menus.imageMenu, component: ImageDetailComponent
    }
];

export var Menus = { //sets up all menus, menus can fire events or open paths?
    //Perhaps is better to have menu entries starting with "_" (better for code completion.)
    mainMenu: {
        _File: { //Menu entry starting with "_" (better for code completion)
            Open: { accelerator: "ctrl+o", fires: Events.OPEN_FOLDER }
        },
        Image: { //Menu configuration starting with "_"
            //Evaluate how to handle enabling/disabling menu items (events perhaps?)

            show: { _navigateTo: "image", _enabledOn: Events.IMAGE.SELECTED },
            edit: {
                _navigateTo: "image/edit", _enabledOn: Events.IMAGE.SELECTED,
                _condition: (folder) => folder != null
            }
        }
    },
    imageMenu: {},
    //Contextual menu. Evaluate how to handle mouse position
    //Can be bound to a component (show on click in the component)?
    contextualImageMenu: {
        contextual: true,
        component: ImageThumbComponent,
        showOn: "click",

        //params will look for "image" property in thumb component
        _ShowImage: { _navigateTo: "image", params: { image: "image" } }
    }
}

var config = {
    events: Events,
    windows: Windows,
    paths: Paths,
    menus: Menus,
    global: {//global constants 
    }
}


//main.ts
var app = new MolecularApp(config);
app.run();
//end - main.ts

//folder.servide.ts
//Probably necessary due to "this" bind on method decorators
//Implementation can ignore all configuration if not in a electron project
@Configure
class FolderService {
    //require electron.remote.require("fs")
    @Service("fs") private fs: any;

    @ListenTo(Events.FOLDER.CHOOSEN)
    @Fires(Events.FOLDER.LOADED)
    loadFolder(folder) {
        var foldersLoaded = [];
        return foldersLoaded;
    }

    load(...a): any { }

    generateAndListThumbs(...any): any { };
}
//

//folder-list.component.ts
class FolderListComponent {
    folders: any[];
    selected: any;

    //Service injection, controled by framework
    //Allow injection of services or let just use of events?
    //Can be useful if possible to separate service execution in a separate process
    //Should generate angular injection
    @Service(FolderService) privatefolder: FolderService

    //Usual way letting angular inject the service
    constructor(private folderService: FolderService) {

    }

    private getTreeNodeFromFolder(folder: any): any { }

    showFolder(base: string) {
        //Possible conversion from service methods decorated with @Fire (or just @Configure)
        //  to a promisse. Alternative to method with @ListenTo
        this.folderService.load(base).then(this.createTreeNode)
    }

    @ListenTo(Events.FOLDER.LOADED)
    createTreeNode(folder) {
        if (!this.selected) this.folders = this.getTreeNodeFromFolder(folder);
        else this.selected.children = this.getTreeNodeFromFolder(folder);
    }

    @Fires(Events.IMAGE.LIST_ALL)
    selectFolder(folder: string) {
        return this.folderService.generateAndListThumbs(folder);
    }

}
//

//image-list.component.ts
//import { Events } from 'configuration';
//import { EventManager } from 'services';

class ImageListComponent {
    index: number;
    selectedImage: string;
    images: string[];

    constructor(private eventManger: EventManager) { }

    @Fires(Events.IMAGE.SHOWIMAGE) //or
    @WalkTo("image")
    displayImage(index: number) {
        this.index = index;
        this.selectedImage = this.images[index];
        return this.selectedImage;
    }

    @ListenTo(Events.IMAGE.SELECT_OTHER)
    changeImage(direction) {
        var index = this.index;
        if (direction.next) index++;
        else index--;
        this.displayImage(index);
    }

    //listImages will be fired on each async load
    @ListenTo(Events.IMAGE.LIST_ALL, { async: true })
    listImages(image) {
        this.images.push(image);
    }

    //Simpler implementation just let the user subscribe to the flow
    @ListenTo(Events.IMAGE.LIST_ALL)
    listImages2(folder) {
        folder.then((image) => this.images.push(image));
    }

    @Fires(Events.IMAGE.SELECTED)
    selectImage(index:number){
        if(!index || index > this.images.length) return null;
        var index = this.index;
        this.selectedImage = this.images[index];
    }
}
//

//image-detail.component.ts
@Params({ image: "image" })
export class ImageDetailComponent2 {
    private image: string;

    @Fires(Events.IMAGE.CHANGE_IMAGE, ["prev"]) //static parameter
    prev() { }

    @Fires(Events.IMAGE.CHANGE_IMAGE)
    next() {
        return "next"; //dynamic parameter
    }
}

//Service instantiation
import {ServiceLocator} from 'molecular/renderer';

@NgModule({
  declarations: [...],
  imports: [...],
  providers: ServiceLocator.provide(
      NodeService1, NodeService2, 'TokenToAnotherNodeService1' ...
  ).concat([AngularManagedService, ...])
  ),
  bootstrap: [...]
})
export class AppModule { }

//ServiceLocator.ts
export class ServiceLocator {
	provide(...tokens){
		const providers = [];
		for(const i in tokens){
			providers.push(
				{provide: tokens[i], useFactory: this.createFactoryFor(tokens[i]};
			);
		}
		return providers;
	}


    createFactoryFor(token){
        
        return function(){
            //Veja detalhes abaixo 
        }
    }
```

    Sobre instanciacao de servicos
        A instancia retornada pelo service-registry eh um simples objeto json serializado. Dessa forma valores primitivos sao retornados corretamente mas objetos e funcoes nao. 
        Analisar a possibilidade de converter para uma instancia de classe real. Nesse caso uma solucao seria a utilizacao de metadados do tipo:

```javascript
        {
            'ServicoX' : {
                propA: {type: Date, params: ['12:00']}
                propB: {type: RegExp, params: ['[a-z]']}
                Em caso de dependencia de servicos seria retornado um proxy para o servico em vez de uma instancia
                propC: {type: 'Service', params: ['AlgumServico']}
            }
        }
```

        Dessa forma cada propriedade mapeada (a nao ser se corresponder a outro servico) seria teria seu valor ja definido e nao seria encaminhado atraves do proxy. Essa abordagem, apesar de complexa tem como vantagem a liberdade de usar propriedades de acesso publico e melhor desempenho (para acesso a essas propriedades, ja que nao passariam pelo proxy). Analisar como o electron serializa e desserializa RegExp e Date 

        A alternativa mais simples seria tratar a instancia somente como proxy e exigir que qualquer propriedade seja retornada com get:

```javascript
        class Servico {
            public get propA(){
                seria gerado um proxy que encaminharia a solicitacao para o registry
            }
        }
```

        O problema dessa abordagem eh que nao existe forma de garantir que o usuario nao ira disponibilizar propriedades publicas ou mesmo de avisa-lo a nao ser pela documentacao

        Alternativamente ainda outra solucao seria gerar um proxy para as todas as propriedades (nao metodos) usando descritores (get, set):

```javascript
        class Servico{
            propA:any = algumValorOuObjeto;
        }

        createProxyForProp(target, prop){
            Object.defineProperty(target, prop, {
                get: function(){
                    encaminhaParaOProxyERetorna();
                }
                set: function(val){
                    encaminhaParaOproxy();
                }
            })
        }
```

        A desvantagem para essa abordagem seria a performance ja que toda solicitacao (metodos e propriedades) passariam pelo proxy.

        O problema de mapeamento ainda ocorre nas passagens de parametros nos metodos. Nesse caso fica praticamente impossivel mapear o parametro, por isso a melhor solucao seria lancar algum erro nesses casos: 

```javascript
        class Servico {
            metodo(parametro:any){
            }
        }
```

        O metodo de deteccao deveria verificar se em algum ponto da hierarquia de cada parametro se encontra algo nao serializavel e lancar uma excecao:

```javascript
    function argumentIsSerializable(arg){
        if(arg instanceof Funvtion) return false;
        if(arg instanceof RegExp) return false;
        if(arg instanceof Date) return false;
        if(arg instanceof Object){
            for(const prop in arg){
                if(!argumentIsSerializable(arg[prop])) return false;
            }
        }
        return true;
    }
    function createProxyFor(target, method){
        ...
        return function(){
            for(i in arguments){
                if(argumentIsSerializable(arguments[i]))
                    throw 'some exception';
            }
        }
    }
```        
    Estudar a possibilidade de gerar metadados para Objecos nao primitivos conhecidos do javascript como Date, RegExp, possibilitando sua serializacao:

```javascript
    function createProxyFor(target, method){
        ...
        return function(){
            var metadata;
            for(i in arguments){
                if(!argumentIsSerializable(arguments[i]))
                    throw 'some exception';
                else metadata = serializa(arguments[i]);
            }
            /*ServiceRegistry devera desserializar parametros e podera serializar o retorno*/
            return desserializa(encaminhaParaOProxy(metadata));
        }
    }
}
```

    Promisses e Observables retornados pelos metodos deverao ser tratados tambem:

```javascript
        class Servico {
            metodo(parametro:any){
                return new Subject();
            }
        }
//On ServiceLocator
        var result = ipcRenderer.send('Servico.metodo',args);
        if(!result.async) return result.value
        else{
            var subject = new Subject(); //tratar outros tb (i.e: Promise)
            return subject;
            ipcRenderer.on('Servico.metodo.return', (event, result){
                subject.emit(result);
            })
        }


//On ServiceRegistry
        ipcMain.on('Servico.metodo', function(event, args){
            var result = servico.metodo(args);
            if(result instanceof Subject, Promise, etc) // ...
                result.addListener((result) 
                    => event.sender.send('Servico.metodo.return', result));
                event.returnValue = {
                    value: null, async: true, type: 'Subject'
                }
        })
```

    A serializacao e desserializacao poderia ser encaminhada a uma classe externa comum ao service-registry e service locator:

```javascript
    const serializadores = {
        'Date' : {
            serialize: function(d){
                return {
                    type: 'Date',
                    value: d.getTime()
                }
            },
            desserialize: function(d){
                return new Date(d.value);
            }
        },
        'Subject' : {
            // Necessita de argumentos diferenciados, ver como tratar
            serialize: function(channel, event, value){
                value.addListener((result) 
                    => event.sender.send(channel + '.return', result));
                return {value:null, type: 'Subject', async: true}
            },
            desserialize: function(chanel, v){
                var subject = new Subject();
                ipcRenderer.on(chanel + '.return', (event, result){
                    subject.emit(result);
                })
                return subject;
            }
        }
    }

    //On ServiceLocator
        var args = [];
        for(i in arguments){
            if(!argumentIsSerializable(arguments[i]))
                    throw 'some exception';
            args.push(
                serializadores[arguments[i].prototype.name].serialize()
            );
        }
        var result = ipcRenderer.send('Servico.metodo',args);
         if(!argumentIsSerializable(result))
                    throw 'some exception';
        return  serializadores[result.prototype.name].desserialize()


//On ServiceRegistry
        ipcMain.on('Servico.metodo', function(event, args){
           // Desserializa argumentos, chama metodo e serializa resultado
        });
```
        Possivelmente, deveria ser permitido a adicao de serializadores adicionais.

```javascript
    class Serializador {
        serializadores = {Date: ...}/
        custom = {};

        serialize(obj){
            if(!objetoSerializavel)
                throw error;
            return 
                serializadores[obj.prototype.name].serialize(obj) ||
                custom[obj.prototype.name].serialize(obj);
        }

        desserialize(obj){
            ...
        }

        adicionarSerializador(name, serializador){
            custom[name] = serializador;
        }
    }

    //on main.ts
    app.adicionarSerializador(nome, serializador);

@NgModule({
    declarations: [...],
    imports: [...],
    providers: ServiceLocator.provide(
        [NodeService1, NodeService2, 'TokenToAnotherNodeService1' ...],
        [serializadoresAdicionais]
    ).concat([AngularManagedService, ...]),
    bootstrap: [...]
})
export class AppModule { }

//main.ts
var app = new MolecularApp({
    ...
    providers: [
        {provide: NodeService1, useClass: NodeService1}
        NodeService2, // same as above
        {provide: NodeService3, useFactory: ()=>{...}},
        {provide: 'TokenToAnotherNodeService1', useClass: NodeService1}
    ],
    serializers: [serializadoresAdicionais]
})

//*/
```
