(
	molecular=../../../;
	starter=./;

	appmodule=$starter/src/app/app.module.ts;
	dst=$starter/node_modules/molecular;

	cd $molecular;
	rm -rf ./build/*
	npm run build && { 
		rm -rf $dst/*
		ls | grep -v 'node_modules' |xargs -I xx cp -avr xx $dst/;
		touch $dst/build/renderer.js;
		touch $dst/build/main.js;
		touch $starter/dist/molecular.bundle.js;
		touch $appmodule;
	};

)

