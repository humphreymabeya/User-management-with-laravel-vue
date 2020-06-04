<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 mt-3">
				<div class="card card-widget widget-user">
          <!-- Add the bg color to the header using any of the bg-* classes -->
          <div class="widget-user-header text-white" style="background: url('./img/photo1.png') center center;">
            <h3 class="widget-user-username text-right">Hum Mabeya</h3>
            <h5 class="widget-user-desc text-right">Web Designer</h5>
          </div>
          <div class="widget-user-image">
            <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
          </div>              
        </div>                
      </div>
			<div class="col-md-12">
        <div class="card">
          <div class="card-header p-2">
            <ul class="nav nav-pills">
            <li class="nav-item"><a class="nav-link active" href="#activity" data-toggle="tab">Activity</a></li>
            <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Settings</a></li>
          </ul>
        </div><!-- /.card-header -->
        <div class="card-body">
          <div class="tab-content">
            <div class="tab-pane active" id="activity">
                    
            </div>
            <!-- /.tab-pane -->
            <div class="tab-pane" id="settings">
              <form class="form-horizontal">
                <div class="form-group row">
                  <label for="inputName" class="col-sm-2 col-form-label">Name</label>
                  <div class="col-sm-10">
                    <input type="text" v-model="form.name" class="form-control" id="inputName" placeholder="Name" :class="{ 'is-invalid': form.errors.has('name') }">
                    <has-error :form="form" field="name"></has-error>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-10">
                      <input type="email" v-model="form.email" class="form-control" id="inputEmail" placeholder="Email" :class="{ 'is-invalid': form.errors.has('email') }">
                      <has-error :form="form" field="email"></has-error>
                    </div>
                </div>
                      
                <div class="form-group row">
                  <label for="inputExperience" class="col-sm-2 col-form-label">Experience</label>
                  <div class="col-sm-10">
                    <textarea class="form-control" v-model="form.bio" id="inputExperience" placeholder="Experience" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                    <has-error :form="form" field="bio"></has-error>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="profilePhoto" class="col-sm-2 col-form-label">Profile Photo</label>
                  <div class="col-sm-10">
                    <input type="file" @change="updateProfile" class="form-input" id="profilePhoto" name="photo">
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-2 col-form-label">Password (Leave empty if not changing)</label>
                  <div class="col-sm-10">
                    <input type="password" v-model="form.password" class="form-control" id="inputPassword" placeholder="Password" :class="{ 'is-invalid': form.errors.has('password') }">
                    <has-error :form="form" field="password"></has-error>
                  </div>
                </div>
                      
                <div class="form-group row">
                  <div class="offset-sm-2 col-sm-10">
                    <button type="submit" @click.prevent="updateInfo" class="btn btn-success">Update</button>
                  </div>
                </div>
              </form>
            </div>
            <!-- /.tab-pane -->
          </div>
          <!-- /.tab-content -->
        </div><!-- /.card-body -->
      </div>
      <!-- /.nav-tabs-custom -->
    </div>
  </div>
</div>
</template>

<script>
import Form from 'vform'
  export default {
    data(){
      return {
        form: new Form({
          id:'',
          name : '',
          email: '',
          password: '',
          type: '',
          bio: '',
          photo: ''
        })
      }
    },
    methods: {
      getProfilePhoto(){
        let photo = (this.form.photo.length > 200) ? this.form.photo : "img/profile/"+ this.form.photo ;
        return photo;
      },
      updateProfile(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        let limit = 1024 * 1024 * 2;
        if(file['size'] > limit){
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'You are uploading a large file',
          })
          return false;
        }
        reader.onloadend = (file) => {
          this.form.photo = reader.result;
        }
        reader.readAsDataURL(file);
      },
      updateInfo(){
        this.$Progress.start();
        if(this.form.password == ''){
          this.form.password = undefined;
        }
        this.form.put('api/profile')
        .then(() => {
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        })
      }
    },
    mounted() {
      console.log('Component mounted.')
    },
    created() {
      axios.get("api/profile").then(({ data }) => (this.form.fill(data)));
    }
  }
</script>

<style>
	.widget-user-header{
		background-position: center;
		background-size: cover;
		height: 250px !important;
	}
</style>
